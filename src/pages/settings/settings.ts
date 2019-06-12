import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { Storage } from '@ionic/storage';
import { LandingPage } from '../landing/landing';
import { TncPage } from '../tnc/tnc';
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy";
import { ChangeEmailPage } from "../change-email/change-email";
import { ChangePasswordPage } from "../change-password/change-password";
import { BlogPage } from "../blog/blog";
import { ContactSupportPage } from "../contact-support/contact-support";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})


/**
 * Handles administrative, external and non-essential features of the application.
 * 
 * @export
 * @class SettingsPage
 */

export class SettingsPage {
   // public section: string = 'account';
    public emails: any = {email1: '', email2: ''};
    public passwords: any = {current: '', password1: '', password2: ''};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public global: GlobalService, 
                public firebase: FirebaseService,
                public storage: Storage) {}

    


    /**
     * Method for user to log out of the application. It resets authToken to allow other users to login. 
     * 
     * 
     * @memberOf SettingsPage
     */
    logout(): void {
        this.firebase.logout();
        this.storage.set('autologin', false);
            // Use setPages to remove all pages except one.
        this.navCtrl.setPages([{page: LandingPage}], this.global.backwardTransition);
    }

    navChangeEmailPage(){
        this.navCtrl.push(ChangeEmailPage);
    }

    navChangePasswordPage(){
        this.navCtrl.push(ChangePasswordPage);
    }

    navContactSupportPage(){
        this.navCtrl.push(ContactSupportPage);
    }

    navTncPage() {
        this.navCtrl.push(TncPage);
    }

    navPrivacyPolicyPage() {
        this.navCtrl.push(PrivacyPolicyPage);
    }
    returntoprofile(){
        this.view.dismiss();
    }
}