export interface Interests {
    savingsinvestments: boolean;
    insurance: boolean;
}

export interface Interests {
    savingsinvestments: boolean;
    insurance: boolean;
}

export class Profile {
    constructor(
        public email: string,
        public name: string,
        public age: number,
        public phone: string,
        public occupation: string,
        public employment: string,
        public timeframe: string,
        public picture: string,
        public interests: Interests,
        public timeOfCreation: number,
        public advisorRequested: boolean,
        public portfolioType: any,
        public isAdmin: boolean,
        public $key?: string,
        public $exists?: boolean   
    ) { }
}

export class FamilyMember {
    constructor(
        //public uid: string,
        public name: string = '',
        public age: number = 0,
        public phone: string = '',
        public occupation: string = '',
        public picture: string = '',
        public otherinfo: string = '',
        public death: boolean = false,
        public accidentalDeath: boolean = false,
        public CI: boolean = false,
        public eCI: boolean = false,
        public TPD: boolean = false,
        public hospitalisation: boolean = false,
        public personalAccident: boolean = false,
        public retirement: boolean = false,
        public maternity: boolean = false,
        public disabilityIncome: boolean = false,
        public $key?: string
    ){}
}

export class Account {
    constructor(
        public equity: LineItem[],
        public cash: LineItem[],
        public insurance: any,
        public familyMembers: any,
        public toBeNotified: boolean //to toggle notification icon
    ) { }
}

export class LineItem {
    constructor(
        public type: string,
        public value: number
    ) { }
}

export class InsurancePlan {
    constructor(
        public productName: string,
        public coverageAmount: number,
        public premiumAmount: number,
        public premiumTerm: number,
        public policyTerm: number,
        public inceptionDate: string
    ) { }
}

export class InsurancePolicy {
    constructor(
        public title: string,
        public photo: string
    ) { }
}

export class Statement {
    constructor(
        public user: string,
        public email: string,
        public type: string,
        public photos: string[],
        public details: BrokerStatement | BankStatement | InsuranceStatement,
        public timestamp: number,
        public processed: boolean = false, //into the drafts 
        public unprocessed: boolean = true,
        public verified: boolean = false    //draft has been verified

    ) { }
}

export class BrokerStatement {
    company: string = '';
    account: string = '';
    date: string = '';
    productName: string = '';
    profitloss: number = 0;
    quantity: number = 0;
    costPrice: number = 0;
    latestPrice: number = 0;
    value: number = 0;
    action: string = '';
    notes: string = '';
}

export class BankStatement {
    company: string = '';
    account: string = '';
    date: string = '';
    value: number = 0;
    notes: string = '';
    transactions: BankTransaction[] = [];
}

export class BankTransaction {
    name: string = '';
    date: string = '';
    value: number = 0;
}

export class Notification {
    constructor(
        public uid: string = '',
        public type: string = 'policy'||'profile'||'picture', //type is used to allow user to navigate from notifcations page.
        public message: string = '',
        public timestamp: number = 0,
        public policyName: string = '',
        public photos: string[] = []
    ) {}
    
}

export class InsuranceStatement {
    public coverage: {death: null, accidentalDeath: null, CI: null, eCI: null, TPD: null,
         hospitalisation: null, personalAccident: null, maternity: null, disabilityIncome: null}
    constructor(
    public hospitalType: string = null,
    public hospitalWard: string = null,   
    public policyName: string = '',
    public insuredPerson: string = '',
    public beneficiary: FamilyMember | string = '',
    public premiumAmount: number,
    public modeOfPayment: string = '',
    public insurerCompany: string = '',
    public advisorName: string = '',
    public advisorContact: number,
    public policyNumber: string = '',
    public frequency: string = '',
    public policyTermFrom: string ='',
    public policyTermTo: string = "",
    public additionalNotes: string = '',
    public policyOwner: string = '',
    public policyType: string = '',
    public countryOfPurchase: string = '', 
    public policyInsurer: string = '',
    public policyRepresentativeAgency: string = '',
    public policyPlanTier: string = '',
    public policyGroupMaxEntryAge: number,
    public policyGroupCompanyName: string = '',
    public policyGroupMaxRenewableAge: number,
    public photos : string[]
    ) {}
}


//purpose: to keep track of the total coverages for display in dashboard (list by coverages).
export class CoverageList {
    constructor(
        public death: number = 0,
        public accidentalDeath: number = 0,
        public CI: number = 0,
        public eCI: number = 0,
        public TPD: number = 0,
        public hospitalisation: number = 0,
        public personalAccident: number = 0,
        public maternity: number = 0,
        public disabilityIncome: number = 0,
    ) { }
}

//purpose: to keep track of list of policies in each type of coverages.
//stores the array of statementIDs of the policies for each type of coverages.
export class CoverageListbyPolicies {

    constructor (
        public death: string[],
        public accidentalDeath: string[],
        public CI: string[],
        public eCI: string[],
        public TPD: string[],
        public hospitalisation: string[],
        public personalAccident: string[],
        public maternity: string[],
        public disabilityIncome: string[]
    ) {}    
}

export class claim {

    constructor (
        public policyToClaim: string = '',
        public countryOfIncident: string = '',
        public cityOfIncident: string = '',
        public dateOfIncident: string = '',
        public describeIncident: string = '',
        public typeOfLoss: string = '',
        public timestamp: number = 0,
        public status: string = ''
    ) {}
}

export class CoverageListTitles {
    public death: string = 'Death';
    public accidentalDeath: string = 'Accidental Death';
    public CI: string = 'Critical Illness';
    public eCI: string = 'Early Critical Illness';
    public TPD: string = 'Total Permanent Disability';
    public hospitalisation: string = 'Hospitalisation';
    public personalAccident: string = 'Personal Accident';
    public maternity: string = 'Pre-natal';
    public disabilityIncome: string = 'Disability Income';
}


