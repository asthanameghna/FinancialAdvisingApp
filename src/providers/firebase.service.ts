import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Profile, CoverageList, CoverageListbyPolicies, claim } from './variables';
import { Subscription } from 'rxjs';
import firebase from 'firebase';

@Injectable()

// One service for access to Firebase. Includes the various classes.
// Version number is kept here for global access.
export class FirebaseService {
    public version: string = '0.7.0';
    public today = new Date();
    public uid: string;
    public programme: string;
    public superadmin: string;

    public profileSub: Subscription;
    public accountsSub: Subscription;

    public profile: Profile;
    public accounts: any;

    public policies: {};
    public claim: {};
    public policiesSub: Subscription;
    public claimsSub: Subscription;
    public localCoverageList = new CoverageList();
    public localCoverageListbyPolicies = new CoverageListbyPolicies([],[],[],[],[],[],[],[],[]);
    public localClaimListbyClaim = new claim('','','','','','');
    public listOfCoverages: any;
   // public notifications: FirebaseListObservable<any>;
    public userPolicies: FirebaseListObservable<any>;
    public userClaims: FirebaseListObservable<any>;
    public familyMemberList: FirebaseListObservable<any>;
    public monthNames: any = { '01': "Jan", '02': "Feb", '03': "Mar", '04':"Apr", '05': "May", '06': "Jun",
        '07': "Jul", '08': "Aug", '09': "Sep", '10': "Oct", '11': "Nov", '12': "Dec"
    };

    constructor(public af: AngularFire) {
        this.listOfCoverages = this.af.database.list('/globalInsurancePolicies');
        this.userPolicies = this.af.database.list('/accounts/' + this.uid + '/insurance');
        this.familyMemberList = this.af.database.list('/accounts/' + this.uid + '/familyMembers');
        this.userClaims = this.af.database.list('/claims/'+ this.uid);
    }

    // Log out from auth and clear all user variables.
    logout(): void {
        this.af.auth.logout();
        this.uid = '';
        this.profile = null;
        this.accounts = null;
        this.profileSub.unsubscribe();
        this.accountsSub.unsubscribe();
    }

    // Calls the global firebase object for certain functions not implemented by AngularFire2.
    resetPassword(email: string): firebase.Promise<any> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    updateEmail(newEmail: string): firebase.Promise<any> {
        return firebase.auth().currentUser.updateEmail(newEmail);
    }

    updatePassword(newPassword: string): firebase.Promise<any> {
        return firebase.auth().currentUser.updatePassword(newPassword);
    }

    sendEmailVerification(): firebase.Promise<any> {
        return firebase.auth().currentUser.sendEmailVerification();
    }

    isEmailVerified(): boolean {
        return firebase.auth().currentUser.emailVerified;
    }

    // Retrieve user's profile based on uid.
    getProfile(): Promise<any> {
        return new Promise((resolve, reject) => {
            let profileUrl = this.af.database.object('/users/' + this.uid);
            this.profileSub = profileUrl.take(1).subscribe(
                (data) => {
                    if (data.$exists)
                        delete data['$exists'];
                    this.profile = data;
                },
                (err: any) => reject(Error(err)),
                () => {
                    console.log('[DEBUG] Profile retrieved from database.');
                    console.log(this.profile);
                    resolve();
                }
            );
        });
    }

    // Retrieve user's accounts based on uid.
    getAccounts(): Promise<any> {
        return new Promise((resolve, reject) => {
            let accountsUrl = this.af.database.object('/accounts/' + this.uid);
            this.accountsSub = accountsUrl.take(1).subscribe(
                (data) => {
                    if (data.$exists)
                        delete data['$exists'];
                    this.accounts = data;

                },
                (err: any) => reject(Error(err)),
                () => {
                    //this.policies = this.accounts.insurance;
                    console.log('[DEBUG] Accounts retrieved from database.');
                    console.log(this.accounts);
                    resolve();
                }
            );
        });
    }

    /**
     * Subscribe to the user's list of insurance policies, so as to enable live-reload
     * and the sum of each coverage types can be computed automatically whenever the data changes
     * (by user via forms or by admins via admin dashboard). 
     * 
     * @returns {Promise<any>} 
     * 
     * @memberOf FirebaseService
     */


    getPolicies(): Promise<any> {
        return new Promise((resolve, reject) => {
            let claimsURL = this.af.database.object('/claims/' + this.uid);
            let policyURL = this.af.database.object('/accounts/' + this.uid + '/insurance');
            this.policiesSub = policyURL.subscribe(
                (data) => {
                    this.policies = data;
                    console.log(this.policies);
                    try {
                        this.calculateCoverage();
                        this.localCoverageListbyPolicies = new CoverageListbyPolicies([],[],[],[],[],[],[],[],[]);
                        this.populateCoverageListByPolicies();
                        this.processPremiumDueDate();
                    } 
                    catch(err) {
                        this.policies = {};
                    }    
                },
                (err: any) => reject(Error(err)),
                () => {
                    resolve();
                }
            )

            this.claimsSub = claimsURL.subscribe((data) => {
                this.claim = data;
                console.log(this.claim);
            },
            (err: any) => reject(Error(err)),
            () => {
                resolve();
            })

        });
    }
    
    
    

    /**
      * Process the coverages by iterating through the list of policies.
      *  
      * @memberOf DashboardPage
      */
    calculateCoverage() {
        //generates a new list.
        this.localCoverageList = new CoverageList();
        for (var key in this.policies) {
            for (var coverageType in this.policies[key].coverage) {
                var amount = this.policies[key].coverage[coverageType];
                //amount is treated as a string in the above line.
                //use parseInt() to cast into integer.
                amount = parseInt(amount);
                this.localCoverageList[coverageType] += amount;
            }
        }

        //sort localCoverageList by increasing order of coverage amount (not covered will appear first).
        //this array will be [[key, amt], [key, amt]...] sorting in increasing order of amt.
        var sortByAmount = [];
        for (var key in this.localCoverageList) {
            sortByAmount.push([key, this.localCoverageList[key]]);
        }
        sortByAmount.sort(function(a, b) {
            return a[1] - b[1];
        });
        
        //"re-built" the localCoverageList object using the new sortByAmount array.
        this.localCoverageList = JSON.parse(JSON.stringify(this.toObject(sortByAmount)));       
    }

    populateCoverageListByPolicies() {
        for (var key in this.policies) {
            //console.log("key: " + key);
            for (var coverageType in this.policies[key].coverage) {
                this.localCoverageListbyPolicies[coverageType].push(key);
            }
        }
    }

    /**
     * Method to create a new object from an array (sorted beforehand).
     * @param {any} arr 
     * @memberOf FirebaseService
     */
    toObject(arr) {
        let obj = arr.reduce((o, [ key, value ]) => {
            o[key] = value;
            return o;
        }, {});

    /* The more 'old school' way:      
        var obj = {};
        arr.forEach(function(data) {
            obj[data[0]] = data[1];
        }) */
        return obj;
    }

    /**
     * Calculates the "premium due date" of each policy, depending on the policyTermFrom (inception date) and frequency.
     * while inception date is before current day, add days according to the frequency until it passes the current day.
     * Then, sort the policy list by ascending order of premium due dates.
     * 
     * @memberOf FirebaseService
     */
    processPremiumDueDate() {
        var sortByDueDate = [];
        //convert the date strings into date objects, calculate premium due dates by adding freq.
        for(var key in this.policies) {
            var date = new Date(this.policies[key].policyTermFrom);
            var freq = this.getDaysFromFrequency(this.policies[key].frequency);
            while(date < this.today) {
                date.setDate(date.getDate() + freq);
            }
            
            var dateStr = date.toISOString().substring(0,10);
            dateStr = this.processDate(dateStr);
            this.policies[key].premiumDueDate = dateStr;
            sortByDueDate.push([key, date]);
        }
        //sort by ascending order of premium due dates
        sortByDueDate.sort(function(a, b) {
            return a[1] - b[1];
        });

        //create new obj and copy it back to this.policies.
        let obj = sortByDueDate.reduce((o, [ key ]) => {
            o[key] = this.policies[key];
            return o;
        }, {});

        this.policies = JSON.parse(JSON.stringify(obj));
        //console.log(this.policies);        
      
    }


    /**
     * Returns the integer corresponding to the frequency of premium payment of the policy.
     * 
     * @param {string} frequency 
     * @returns {number} freq
     * @memberOf FirebaseService
     */
    getDaysFromFrequency(frequency: string) {
        var toReturn;
        switch (frequency) {
            case 'One Time':
                toReturn = 0;
                break;
            case 'Monthly':
                toReturn = 30;
                break;
            case 'Quarterly':
                toReturn = 92;
                break;
            case 'Bi-Annually':
                toReturn = 183;
                break;
            case 'Annually':
                toReturn = 365;
                break;                                
        }
        return toReturn;
    }

    processDate(date) {
        var index = 5;  //end position of year
        var replace = this.monthNames[date.substring(5,7)];
        var res = date.substring(8) + ' ' + replace + ' ' + date.substring(0, index-1);
        return res;
    }
}
