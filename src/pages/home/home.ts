import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';

import { DashboardPage } from '../dashboard/dashboard';
import { ContentsPage } from '../contents/contents';

import { SettingsPage } from '../settings/settings';
//import { BlogPage } from '../blog/blog';
import { NotificationPage } from '../notifications/notifications';
import { ProfilePage } from '../profile/profile';
import { AngularFire, FirebaseListObservable } from "angularfire2";

@Component({
    selector: 'page-tabs',
    templateUrl: 'home.html'
})

// TODO: Standardise tab bar styles.
export class TabsPage {
    @ViewChild('content') tabs: Tabs;
    // Attach pages to the tabs.
    public tab1Root = DashboardPage;
    public tab2Root = ContentsPage;
    public tab4Root = NotificationPage;
    public tab5Root = ProfilePage;
    public index = this.navParams.get('index');
    public notifications: FirebaseListObservable<any>;
    
    constructor(public nav: NavController,
                public navParams: NavParams, 
                public global: GlobalService,
                public firebase: FirebaseService, 
                public storage: Storage,
                public af: AngularFire){
    }

    ionViewWillEnter(){
        console.log("ionViewWillEnter HomePage")
        this.loadList();
    }

    loadList(){
        this.notifications = this.af.database.list('/notifications', {
            query: {
                orderByChild: 'uid',
                equalTo: this.firebase.uid
            }
        });
    }

    navSettingsPage(): void {
        this.nav.push(SettingsPage);
    }

}