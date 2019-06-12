import { Component} from '@angular/core';
import { NavController, NavParams, ModalController, Content, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Notification } from '../../providers/variables';
import { ProfilePage } from '../profile/profile';
import { DashboardPage } from "../dashboard/dashboard";
import { PictureNotificationPage } from "../picture-notification/picture-notification";


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationPage {
public sortedNotifications: FirebaseListObservable<any[]>;
public content: Content;
public notifications: FirebaseListObservable<any>;
public notification = new Notification('','picture','',0,'',[]);
public modal: any;

constructor(    public navCtrl: NavController, 
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public firebase: FirebaseService,
                public global: GlobalService,
                public af: AngularFire,
                public alertCtrl: AlertController    ) 
            {}


ionViewWillEnter() {
    console.log('ionViewDidLoad NotificationPage');
    console.log(this.firebase.uid);
    this.loadList();
}


loadList(){
    this.notifications = this.af.database.list('/notifications', {
        query: {
            orderByChild: 'uid',
            equalTo: this.firebase.uid
        }
    });
    this.sortList();
}

sortList(){
    this.sortedNotifications = this.notifications
  .map(items => items.sort((a, b) => a.timestamp - b.timestamp)) as FirebaseListObservable<any[]>;
  console.log('Entered function');
}

navToRightPlace(notification){
    this.notification = notification;
    console.log(notification);
    console.log('inside function');
    if (this.notification.type === 'policy'){
        this.navCtrl.push(DashboardPage, {
            section: 'change'
        });
    }   

    if (this.notification.type === 'profile'){
        this.navCtrl.push(ProfilePage);
    }
    if (this.notification.type === 'picture'){
        this.navCtrl.push(PictureNotificationPage, {
            notification: this.notification
        });
    }
}

deleteNotification(notification) {
        let alert = this.alertCtrl.create({
            message: 'Are you sure you want to delete this notification?',
            buttons: [{
                text: 'Delete',
                handler: () => {
                    alert.dismiss().then(() => {
                            this.confirmDeleteNotification(notification);
                        });
                }
            },
            {
                text: 'Cancel',
                handler: () => {
                    alert.dismiss();
                }
            }
            ]
        });
        alert.present();
    }

confirmDeleteNotification(notification){
    var notificationRef = this.firebase.af.database.object('/notifications/' + notification.$key);
    notificationRef.remove();
}
}
