'use strict'

const Notification = use('App/Models/Notification');

class NotificationController {

    async getNotifications({auth, response}) {
        const userNotifications = await auth.current.user.notifications()
              .orderBy('created_at', 'desc')
              .fetch();

        const notificationInfos = userNotifications.toJSON();
        let notifications = [];
        let notification = {};

        for (var i = 0; i < notificationInfos.length; i++) {
            notification = {
                message: notificationInfos[i].message,
                readed: notificationInfos[i].readed,
                created_at: notificationInfos[i].created_at,
                status: notificationInfos[i].status,
                id: notificationInfos[i].id
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
            message: notification.message,
            readed: notification.readed,
            created_at: notification.created_at,
            status: notification.status,
            id: notification.id
        };

        return response.json({
            status: 'success',
            data: notificationInfo
        });
    }

    async addNotif({auth, request, response}) {
        const parameters = request.only(['message', 'status'])
        const notif = {
            user_id: auth.current.user.id,
            message: parameters.message,
            readed: false,
            status: status
        }

        const newNotif = await Notification.create(notif);

        return response.json({
            status: 'success',
            data: newNotif
        });
    }
}

module.exports = NotificationController
