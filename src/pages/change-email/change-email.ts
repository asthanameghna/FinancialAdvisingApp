import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-changeemail',
    templateUrl: 'change-email.html'
})

export class ChangeEmailPage {
   // public section: string = 'account';
    public emails: any = {email1: '', email2: ''};
    public passwords: any = {current: '', password1: '', password2: ''};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public global: GlobalService, 
                public firebase: FirebaseService,
                public storage: Storage) {}


    attemptChangeEmail(): void {
        if (this.emails.email1 === this.emails.email2) {
            this.global.createLoading('Just a sec...');

            this.firebase.updateEmail(this.emails.email1).then(
                () => {
                    this.firebase.profile.email = this.emails.email1;
                    this.emails = {email1: '', email2: ''};
                    this.firebase.af.database.object('/users/' + this.firebase.uid + '/profile').update({email: this.firebase.profile.email}).then(
                        () => {
                            this.global.loading.dismiss().then(() => {
                                this.global.createToast('Request successfully sent. Please check ' + this.firebase.profile.email + ' to verify.');
                            });
                        },
                        (error: any) => {
                            this.global.loading.dismiss().then(() => {
                                this.global.createToast(error.message);
                            });
                        }
                    )
                    
                },
                (error: any) => {
                    console.log(error);
                    this.global.loading.dismiss().then(() => {
                        this.global.createToast(error.message);
                    });
                }
            );
        }
        else {
            this.global.createError('Error. The two emails do not match!');
        }
    }
}