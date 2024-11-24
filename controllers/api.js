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
                user_id:user_id,
                chat_channels:{
                    public: req.body.is_public,
                    channel_name:{
                        contains: search_txt
                    }
                }
            },
            include:{
                chat_channels: true
            }
        });

        const channel_list = channels.map(member=>member.chat_channels);


        res.status(200).json({ list: channel_list });
    } catch (error) {
        console.error('Błąd podczas pobierania kanałów:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
};
