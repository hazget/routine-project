import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/AccountListUpdate__c';
import UPLOAD_ACCOUNT_RECORD_MESSAGE from '@salesforce/messageChannel/UploadAccountRecord__c';
import { NavigationMixin } from 'lightning/navigation';
import searchAccounts from '@salesforce/apex/AccountsController.searchAccounts';

export default class AccountList extends NavigationMixin(LightningElement) {

	searchTerm = '';
	accounts;
	@wire(MessageContext) messageContext;
	@wire(searchAccounts, { searchTerm: '$searchTerm' })
	loadAccounts(result) {
		this.accounts = result;
		if (result.data) {
			const message = {
				accounts: result.data
			};
			publish(this.messageContext, ACCOUNT_LIST_UPDATE_MESSAGE, message);
		}
	}

	handleSearchTermChange(event) {
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}

	get hasResults() {
		return (this.accounts.data.length > 0);
	}

	handleAccountSelected(event) {

		publish(this.messageContext, UPLOAD_ACCOUNT_RECORD_MESSAGE, {
			accountId: event.detail
		});
	}

}