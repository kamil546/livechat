const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.user_basic = async (req,res) => {
    const user_id = req.user ? req.user.user_id : 0;


const user_basic = await prisma.chat_users.findFirst({
    where:{
        user_id: user_id
    }
});


res.status(200).json(user_basic);
};





exports.get_messages = async (req, res) => {


    const user_id = req.user ? req.user.user_id : 0;
    const channel_id  = req.params.channel_id;
    const page_id  = req.params.page_id || 1;
    const page_size = 10;



    try {
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id,10),
            },
        });
        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });

        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id,10),
                user_id: user_id,
            },
        });
        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });




        const messages = await prisma.chat_messages.findMany({
            where: { channel_id: parseInt(channel_id, 10) },
            orderBy: { created_time: 'asc' },
            select: {
                message_id: true,
                message_txt: true,
                created_time: true,
                chat_channel_members: {
                    select: {
                        member_id: true,
                        member_nick: true,
                        chat_users: {
                            select: {
                                username: true,
                                avatar_file_id: true,
                            },
                        },
                    },
                },
            },
        });

        const res_messages = messages.map((msg) => ({
            mess_id: msg.message_id,
            member_id: msg.chat_channel_members.member_id,
            message: msg.message_txt,
            created_time: msg.created_time,
            username: msg.chat_channel_members.chat_users.username,
            avatar: msg.chat_channel_members.chat_users.avatar_file_id? `/uploads/user/${msg.chat_channel_members.chat_users.avatar_file_id}`: '/img/defaults/avatar.png',
            nickname: msg.chat_channel_members.member_nick || msg.chat_channel_members.chat_users.username,
        }));

        res.status(200).json(res_messages);
    } catch (error) {
        console.error('Błąd podczas pobierania wiadomości:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }






};







exports.get_channels = async (req, res) => {
    try {
        const user_id = req.user ? req.user.user_id : 0;
        const search_txt = req.body.search_txt || '';

        if (typeof req.body.is_public !== 'boolean') {
            return res.status(400).json({ message: 'Niepoprawna wartość typu kanału.' });
        }
        if (typeof search_txt !== 'string' || search_txt.length > 100) {
            return res.status(400).json({ message: 'Niepoprawny format wyszukiwanego tekstu.' });
        }


        const channels = await prisma.chat_channel_members.findMany({
            where: {
                user_id: parseInt(user_id, 10),
                chat_channels: {
                        public: req.body.is_public,
                        channel_name: { contains: search_txt }
                }
            },
            select: {
                chat_channels: {
                    select: {
                        channel_id: true, 
                        channel_name: true,
                        channel_desc: true,
                        ico_file_id: true,
                        chat_acc_files:{
                            select:{
                                file_path: true
                            }
                        }
                    }
                }
            }
        });

        const channel_list = channels.map(channel => {
            return {
              channel_id: channel.chat_channels.channel_id,
              channel_name: channel.chat_channels.channel_name,
              channel_desc: channel.chat_channels.channel_desc,
              channel_ico: channel.chat_channels.chat_acc_files ? channel.chat_channels.chat_acc_files.file_path : null
            };
          });




        res.status(200).json({ list: channel_list});
    } catch (error) {
        console.error('Błąd podczas pobierania kanałów:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
};
