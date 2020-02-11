'use strict'

const Notification = use('App/Models/Notification');

class NotificationController {

    async getNotifications({auth, response}) {
        const userNotifications = await Notification.query()
        .where("user_id", auth.current.user.id)
        .fetch();

        const notificationInfos = userNotifications.toJSON();
        let notifications = [];
        let notification = {};

        for (var i = 0; i < notificationInfos.length; i++) {
            notification = {
                user_id: auth.current.user.id,
                message: notificationInfos[i].message,
                readed: notificationInfos[i].readed,
                created_at: notificationInfos[i].created_at
            };
            notifications.push(notification);
        }

        return response.json({
            status: 'success',
            data: notifications
        });
    }

    async deleteNotification({auth, params, response}) {
        const userNotification = await Notification.query()
        .where("user_id", auth.current.user.id)
        .where('id', params.id)
        .fetch();

        if (userNotification.rows.length == 0) {
            return response.status(404).json({
                status: 'error',
                message: 'The notification doesn\'t exist'
            });
        }

        await Notification.query()
        .where("user_id", auth.current.user.id)
        .where('id', params.id)
        .delete();

        return response.json({
            status: "success",
            data: userNotification
        });
    }

    async modifyNotification({auth, params, request, response}) {
        const notification = await Notification.find(params.id);
        const readed = request.only('readed');

        if (!notification || notification.user_id != auth.current.user.id)
            return response.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });

        if (readed === undefined || typeof readed != "boolean")
            return response.status(404).json({
                status: 'error',
                message: 'Invalid parameter'
            });
        
        notification.readed = readed;
        await notification.save();

        const notificationInfo = {
            user_id: notification.user_id,
            message: notification.message,
            readed: notification.readed
        };

        return response.json({
            status: 'success',
            data: notificationInfo
        });
    }

    async addNotif({auth, request, response}) {
        const parameters = request.only(['message'])
        const notif = {
            user_id: auth.current.user.id,
            message: parameters.message,
            readed: false
        }

        const newNotif = await Notification.create(notif);
        
        return response.json({
            status: 'success',
            data: newNotif
        });
    }
}

module.exports = NotificationController