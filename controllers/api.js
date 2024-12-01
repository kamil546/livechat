const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

exports.user_basic = async (req,res) => {
    const user_id = req.user ? req.user.user_id : 0;


const user_basic = await prisma.chat_users.findFirst({
    where:{
        user_id: user_id
    }
});


res.status(200).json(user_basic);
};




exports.add_member = async (req,res) => {
    const user_id = req.user ? req.user.user_id : 0;
    const channel_id  = req.params.channel_id;
    const { member_ids} = req.body;

    if (!Array.isArray(member_ids) || member_ids.length === 0) {
        return res.status(400).json({ error: 'Musisz podać co najmniej jednego członka.' });
    }
    try{
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });
        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });
        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: user_id,
            },
        });
        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });


        const existingMembers = await prisma.chat_channel_members.findMany({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: { in: member_ids }, 
            },
            select: {
                user_id: true,
            },
        });

        const existingMemberIds = existingMembers.map(member => member.user_id);
        const newMembersToAdd = member_ids.filter(member_id => !existingMemberIds.includes(member_id));

        if (newMembersToAdd.length === 0) return res.status(400).json({error: 'Podani użytkownicy są już członkami tego kanału.',});
        


        const addedMembers = await prisma.chat_channel_members.createMany({
            data: member_ids.map((member_id) => ({
                user_id: member_id, 
                channel_id: parseInt(channel_id, 10),
                join_time: new Date(),
            })),
        });

        if(addedMembers) res.status(200).json({ success: true, addedMembers });
        res.status(500).json({ err: 'Podczas dodawania wystąpił błąd..' });

    }
    catch (err) {
        console.error('Błąd podczas dodawania członków:', err);
        res.status(500).json({ err: 'Wystąpił błąd serwera.' });
    }


};

exports.remove_member = async (req,res) => {
    const user_id = req.user ? req.user.user_id : 0;
    const channel_id  = req.params.channel_id;
    const member_id = req.params.member_id;


    try{
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });
        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });
        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: user_id,
            },
        });
        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });


        const memberExists = await prisma.chat_channel_members.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
                member_id: parseInt(member_id,10)
            },
        });
        if (!memberExists) return res.status(404).json({ error: 'Uzytkownik o podanym ID nie istnieje.' });

        

        const user_role = userMembership.member_role;
        if(parseInt(user_role,10)!==1) return res.status(403).json({ error: 'Brak wymaganych uprawnien..' });
        const removedMember = await prisma.chat_channel_members.delete({
            where: {
              channel_id: parseInt(channel_id,10),
              member_id: parseInt(member_id,10)
            }
          });

          if(removedMember) return res.status(200).json({message: 'API: Zmodyfikowano pomyślnie',});   
          return res.status(500).json({ message: 'API: Wystąpił błąd podczas usuwania uzytkownika' });
    }
    catch(err){
        console.error(error);
        return res.status(500).json({ message: 'API: Wystąpił błąd podczas aktualizacji kanału' });
    }



};




exports.update_member = async (req,res) => {
    const user_id = req.user ? req.user.user_id : 0;
    const channel_id  = req.params.channel_id;
    const member_id = req.params.member_id;
    const { member_role, member_nick} = req.body;

    try{
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });
        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });


        const memberExists = await prisma.chat_channel_members.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
                member_id: parseInt(member_id,10)
            },
        });
        if (!memberExists) return res.status(404).json({ error: 'Uzytkownik o podanym ID nie istnieje.' });


        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: user_id,
            },
        });
        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });


        const user_role = userMembership.member_role;

        const updatedData = {};
        if (member_nick) updatedData.channel_desc = channel_desc;
        if (member_role){
            if(parseInt(user_role,10)!==1) return res.status(403).json({ error: 'Brak wymaganych uprawnien..' });
            updatedData.channel_name = channel_name;
        } 

        const updatedMember = await prisma.chat_channel_members.update({
            where: {
              channel_id: parseInt(channel_id,10),
              member_id: parseInt(member_id,10)
            },
            data: updatedData,
          });
          if(updatedMember) return res.status(200).json({message: 'API: Zmodyfikowano pomyślnie',});
          return res.status(500).json({ message: 'API: Wystąpił błąd podczas aktualizacji kanału' });

    }
    catch(err){
        console.error(error);
        return res.status(500).json({ message: 'API: Wystąpił błąd podczas aktualizacji kanału' });
    }

};


exports.update_channel = async (req, res) => {
    const user_id = req.user ? req.user.user_id : 0;
    const channel_id  = req.params.channel_id;
    const { channel_name, channel_desc, channel_style, ico_file_id } = req.body;
  
    try {   
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });

        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });

        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: user_id,
            },
        });
        
        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });


  
      const updatedData = {};
      if (channel_name) updatedData.channel_name = channel_name;
      if (channel_desc) updatedData.channel_desc = channel_desc;
      if (channel_style !== undefined) updatedData.channel_style = channel_style;
      if (ico_file_id !== undefined) updatedData.ico_file_id = ico_file_id;
  

      const updatedChannel = await prisma.chat_channels.update({
        where: {
          channel_id: parseInt(channel_id,10),
        },
        data: updatedData,
      });

      if(updatedChannel) return res.status(200).json({message: 'API: Parametr kanału został zaktualizowany pomyślnie',});
      return res.status(500).json({ message: 'API: Wystąpił błąd podczas aktualizacji kanału' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'API: Wystąpił błąd podczas aktualizacji kanału' });
    }
  };


exports.get_messages = async (req, res) => {
    const user_id = req.user ? req.user.user_id : 0;
    const channel_id = req.params.channel_id;
    const page_size = 30;
    let condition = {
        channel_id: parseInt(channel_id, 10),
    };

    if (req.params.mess_id) {
        condition.message_id = {
            lt: parseInt(req.params.mess_id, 10),
        };
    }

    try {
        // Sprawdzamy, czy kanał istnieje
        const channelExists = await prisma.chat_channels.findUnique({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });

        if (!channelExists) return res.status(404).json({ error: 'Kanał o podanym ID nie istnieje.' });

        // Sprawdzamy, czy użytkownik jest członkiem kanału
        const userMembership = await prisma.chat_channel_members.findFirst({
            where: {
                channel_id: parseInt(channel_id, 10),
                user_id: user_id,
            },
        });

        if (!userMembership) return res.status(403).json({ error: 'Nie masz dostępu do tego kanału.' });

        const memberCount = await prisma.chat_channel_members.count({
            where: {
                channel_id: parseInt(channel_id, 10),
            },
        });

        const channel_type = memberCount === 2 ? 'private' : 'group';

        // Przygotowujemy dane kanału
        const channel_info = {
            channel_id: channelExists.channel_id,
            channel_name: channelExists.channel_name,
            channel_desc: channelExists.channel_desc,
            channel_style: channelExists.channel_style,
            channel_type: channel_type,
            member_count: memberCount,
            member_id: userMembership.member_id,
            member_role: userMembership.member_role,
            ico_file_id: channelExists.ico_file_id
        };

        // Pobieramy wiadomości na kanał
        const messages = await prisma.chat_messages.findMany({
            where: condition,
            orderBy: { message_id: 'desc' },
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
            take: page_size,
        });

        messages.reverse();
        const res_messages = messages.map((msg) => ({
            mess_id: msg.message_id,
            member_id: msg.chat_channel_members.member_id,
            message: msg.message_txt,
            created_time: formatTime(new Date(msg.created_time)),
            username: msg.chat_channel_members.chat_users.username,
            avatar: msg.chat_channel_members.chat_users.avatar_file_id
                ? `/uploads/user/${msg.chat_channel_members.chat_users.avatar_file_id}`
                : '/img/defaults/avatar.png',
            nickname: msg.chat_channel_members.member_nick || msg.chat_channel_members.chat_users.username,
        }));

        // Zwracamy odpowiedź z danymi kanału i wiadomościami
        res.status(200).json({ channel_info: channel_info, messages: res_messages });

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
        if(!channels) res.status(500).json({ message: 'Wystąpił błąd podczas pobierania kanałów' });

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
