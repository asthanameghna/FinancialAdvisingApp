import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Keyboard, StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions} from '@ionic-native/push';

import { IntroPage } from '../pages/intro/intro';
import { LoadingPage } from '../pages/loading/loading';

@Component({
    templateUrl: 'app.html'
})
export class HiveupApp {
    rootPage: any;

    constructor(platform: Platform, storage: Storage, public push: Push, public alertCtrl: AlertController) {
        storage.get('autologin').then(data => {
            if (data) 
                this.rootPage = LoadingPage;
            else
                this.rootPage = IntroPage;
        });
        
        platform.ready().then(() => {
            //StatusBar.overlaysWebView(false);
            StatusBar.styleLightContent();
            Splashscreen.hide();
            this.pushsetup();
            
            // Some platform-specific hacks for iOS in dealing with the keyboard.
            // Will resize the entire app upon keyboard show, and return to 100% on hide.
            if (platform.is('ios')) {
                let appEl: HTMLElement = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]);
                let appElHeight: number = appEl.clientHeight;

                Keyboard.disableScroll(true);
                Keyboard.hideKeyboardAccessoryBar(false);
                window.addEventListener('native.keyboardshow', (e) => {
                    appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
                });

                window.addEventListener('native.keyboardhide', () => {
                    appEl.style.height = '100%';
                });
            }
        });
    }

    pushsetup(){
        const options: PushOptions = {
            android: {
                senderID: '978047471474'
            },
            ios: {
                alert: 'true',
                badge: 'true',
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
            if(notification.additionalData.foreground) {
                let youralert = this.alertCtrl.create({
                    title: notification.title,
                    message: notification.message,
                    buttons: ['Dismiss']
                });
                youralert.present();
            }
        });

       // pushObject.on('registration').subscribe((registration: any) => alert('Device registered' + registration));

      pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }
}
