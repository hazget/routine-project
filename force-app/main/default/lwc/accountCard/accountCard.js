import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import UPLOAD_ACCOUNT_RECORD_MESSAGE from '@salesforce/messageChannel/UploadAccountRecord__c';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

const FIELDS = [
    'Account.Name',
    'Account.Industry',
    'Account.Type',
    'Account.Budget__c',
    'Account.Description'
];


export default class AccountCard extends NavigationMixin(LightningElement) {

    @api recordId;
    @track account;
    @track name;
    @track industry;
    @track type;
    @track budget;
    @track description;

    @wire(MessageContext) messageContext;
    accountSelectionSubscription;
    connectedCallback() {
        this.accountSelectionSubscription = subscribe(
            this.messageContext,
            UPLOAD_ACCOUNT_RECORD_MESSAGE,
            (message) => this.handleAccountSelected(message.accountId)
        );
    }

    handleAccountSelected(accountId) {
        this.recordId = accountId;
        console.log(accountId);
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading account',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.account = data;
            this.name = this.account.fields.Name.value;
            this.industry = this.account.fields.Industry.value;
            this.type = this.account.fields.Type.value;
            this.budget = this.account.fields.Budget__c.value;
            this.description = this.account.fields.Description.value;
        }
    };

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: ACCOUNT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}