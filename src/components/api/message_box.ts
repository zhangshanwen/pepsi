import i18n from '../../plugins/i18n'

import {ElMessageBox} from 'element-plus'

export const confirmBox = (
    actionMethod: Function,
    options: {
        message: string,
    }
    ) => {
        ElMessageBox.confirm(options.message, i18n.global.t('i18n.prompt'), {
            type: 'warning',
            roundButton: true,
            cancelButtonText: i18n.global.t('i18n.cancel'),
            confirmButtonText: i18n.global.t('i18n.confirm'),
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
    actionMethod: Function,
    options: {
        message: string,
    }
    ) => {
        ElMessageBox.confirm(options.message, i18n.global.t('i18n.prompt'), {
            type: 'warning',
            roundButton: true,
            cancelButtonText: i18n.global.t('i18n.cancel'),
            confirmButtonText: i18n.global.t('i18n.confirm'),
            beforeClose: (action, instance, done) => {
                actionMethod();
                done();
            }
        }).catch(() => {
        });
        return {}
    }
;




