import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-changepassword',
    templateUrl: 'change-password.html'
})

export class ChangePasswordPage {
   // public section: string = 'account';
    public emails: any = {email1: '', email2: ''};
    public passwords: any = {current: '', password1: '', password2: ''};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public global: GlobalService, 
                public firebase: FirebaseService,
                public storage: Storage) {}


   attemptChangePassword(): void {
        if (this.passwords.password1 === this.passwords.password2) {
            this.global.createLoading('Just a sec...');

            this.firebase.af.auth.login({ email: this.firebase.profile.email, password: this.passwords.current }).then(
                (data) => {
                    this.firebase.updatePassword(this.passwords.password1).then(
                        () => {
                            this.global.loading.dismiss().then(() => {
                                this.passwords = {current: '', password1: '', password2: ''};
                                this.global.createToast('New password successfully set.');
                            });
                        },
                        (error: any) => {
                            console.log(error);
                            this.passwords = {current: '', password1: '', password2: ''};
                            this.global.loading.dismiss().then(() => {
                                if (error.code === 'auth/wrong-password')
                                    this.global.createToast('Current password is incorrect. Please try again.');
                                else
                                    this.global.createToast(error.message);
                            });
                        }
                    );
                },
                (error: any) => {
                    console.log(error);
                    this.passwords = {current: '', password1: '', password2: ''};
                    this.global.loading.dismiss().then(() => {
                        this.global.createToast(error.message);
                    });
                }
            );
        }
        else {
            this.global.createError('Error. The two passwords do not match!');
        }
    }
}