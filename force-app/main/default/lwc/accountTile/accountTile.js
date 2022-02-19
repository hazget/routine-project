import { LightningElement, api } from 'lwc';

export default class AccountTile extends LightningElement {
    @api account;
    
    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.account.Id
        });
        this.dispatchEvent(selectedEvent);
    }
}