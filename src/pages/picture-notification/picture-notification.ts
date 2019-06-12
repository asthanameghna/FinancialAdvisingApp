import { Component } from '@angular/core';
import { Platform, ModalController, NavController, NavParams, AlertController} from 'ionic-angular';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
//import firebase from 'firebase';

import { Notification } from '../../providers/variables';
//import { ImagePicker} from 'ionic-native';

declare var cordova: any;



@Component({
    selector: 'page-picturenotification',
    templateUrl: 'picture-notification.html'
})

export class PictureNotificationPage {
    public notification: Notification = new Notification('','policy','',0,'',[]);

    constructor(public platform: Platform,
                public nav: NavController,
                public navparams: NavParams,
                public alert: AlertController,
                public modalCtrl: ModalController,
                public global: GlobalService,
                public firebase: FirebaseService,
                ) {
                    this.notification = this.navparams.get('notification');
        }
    

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad PictureNotificationPage')
    }

}