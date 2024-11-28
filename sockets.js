const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    // Middleware do weryfikacji JWT
    io.use((socket, next) => {
        const token = socket.handshake.query.token;

        if (token) {
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.error('Błąd JWT:', err.message);
                    socket.userId = 0;
                    return next();
                }
                socket.userId = decoded.user_id;
                next();
            });
        } else {
            socket.userId = 0;
            next();
        }
    });


    async function verifyMembership(socket, { channelId }, callback) {
        try {
            const membership = await prisma.chat_channel_members.findFirst({
                where: {
                    channel_id: parseInt(channelId, 10),
                    user_id: socket.userId,
                },
                include: {
                    chat_users: {
                        select: {
                            username: true,
                            avatar_file_id: true,
                        },
                    },
                },
            });
    
            if (!membership) {
                socket.emit('error', { message: 'Nie jesteś członkiem tego kanału.' });
                return;
            }
    
            socket.channelMembership = membership;
            callback();
        } catch (err) {
            console.error('Błąd weryfikacji członkostwa:', err);
            socket.emit('error', { message: 'Wystąpił błąd podczas weryfikacji członkostwa.' });
        }
    }
    
    



    io.on('connection', (socket) => {
        console.log('Użytkownik połączony:', socket.id, 'ID użytkownika:', socket.userId);

        // Zdarzenie dołączania do kanału
        socket.on('joinChannel', (data, callback) => {
            verifyMembership(socket, data, async () => {
                const { channelId } = data;
        
                try {
                    console.log(`Użytkownik ${socket.userId} dołączył do kanału: ${channelId}`);
                    socket.join(`channel-${channelId}`);
        
                    // Sprawdzamy, czy callback jest funkcją
                    if (typeof callback === 'function') {
                        callback({ success: true });
                    }
                } catch (err) {
                    console.error('Błąd dołączania do kanału:', err);
        
                    if (typeof callback === 'function') {
                        callback({ success: false, message: 'Wystąpił błąd podczas dołączania do kanału.' });
                    } else {
                        socket.emit('error', { message: 'Wystąpił błąd podczas dołączania do kanału.' });
                    }
                }
            });
        });
        

        socket.on('sendMessage', async (data, callback) => {
            const { channelId, message } = data;
            if (!message || message.trim() === '') {
                return callback({ success: false, message: ' Wiadomość nie może być pusta.' });
            }

        
            verifyMembership(socket, { channelId }, async () => {
                const { chat_users: user, member_id: memberId, member_nick: nickname } = socket.channelMembership;
        
                try {
                    const avatar = user?.avatar_file_id? await prisma.chat_acc_files.findUnique({where: { file_id: user.avatar_file_id },}): { file_path: '/img/defaults/avatar.png' };
        
                    // Utwórz wiadomość w bazie danych
                    const newMessage = await prisma.chat_messages.create({
                        data: {
                            channel_id: parseInt(channelId, 10),
                            member_id: memberId,
                            message_txt: message,
                            message_type: 0,
                        },
                    });
        
                    // Emituj wiadomość do wszystkich w kanale
                    io.to(`channel-${channelId}`).emit('newMessage', {
                        member_id: newMessage.member_id,
                        message_id: newMessage.message_id,
                        username: nickname || user?.username,
                        avatar: avatar.file_path,
                        message: newMessage.message_txt,
                        created_time: newMessage.created_time.toLocaleString(),
                    });
        
                    callback({ success: true, messageId: newMessage.message_id });
                } catch (err) {
                    console.error('Błąd wysyłania wiadomości:', err);
                    socket.emit('error', { message: 'Wystąpił błąd podczas wysyłania wiadomości.' });
                }
            });
        });
        
        

        


        socket.on('disconnect', () => {
            console.log('Użytkownik odłączony:', socket.id);
        });
    });
};
