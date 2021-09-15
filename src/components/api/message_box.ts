import {ElMessageBox} from 'element-plus'

export const confirmBox = (
    t: Function,
    actionMethod: Function,
    options: {
        message: string,
    },
    ) => {
        ElMessageBox.confirm(options.message, t('i18n.prompt'), {
            type: 'warning',
            roundButton: true,
            cancelButtonText: t('i18n.cancel'),
            confirmButtonText: t('i18n.confirm'),
            beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                    actionMethod();
                }
                done();
            }
        }).catch(() => {
        });
        return {}
    }
;

export const confirmTipBox = (
    t: Function,
    actionMethod: Function,
    options: {
        message: string,
    },
    ) => {
        ElMessageBox.confirm(options.message, t('i18n.prompt'), {
            type: 'warning',
            roundButton: true,
            cancelButtonText: t('i18n.cancel'),
            confirmButtonText: t('i18n.confirm'),
            beforeClose: (action, instance, done) => {
                actionMethod();
                done();
            }
        }).catch(() => {
        });
        return {}
    }
;




