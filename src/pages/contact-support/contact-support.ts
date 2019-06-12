import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { Storage } from '@ionic/storage';
import { EmailComposer } from 'ionic-native';

@Component({
selector: 'contact-support',
templateUrl: 'contact-support.html',
})
export class ContactSupportPage {

    public contact: any = {query: ''};

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public global: GlobalService, 
        public firebase: FirebaseService,
        public storage: Storage,
        public emailComposer: EmailComposer) {}

        ionViewDidLoad() {
            console.log('ionViewWillEnter ContactSupportPage');
          }      

        /*sendSupportEmail(): void {
            this.global.createLoading('Just a sec...');
            }  */

            sendSupportEmail() {
                let email = {
                    to: 'contact@hive-up.com',
                    subject: 'Customer Service (App)',
                    body: this.contact.query
                }

                EmailComposer.open(email);
            }    
            
}