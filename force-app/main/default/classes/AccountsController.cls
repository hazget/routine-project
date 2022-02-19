public with sharing class AccountsController {
@AuraEnabled(Cacheable=true)
    public static Account[] getAllAccounts() {
        return [
            SELECT
                Id, Name, Owner.Name, Budget__c, NumberOfEmployees, Industry, Description, Type
            FROM Account    
        ];
    }
     @AuraEnabled(Cacheable=true)
    public static Account[] searchAccounts(String searchTerm) {
        
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getAllAccounts();
        }
        
        searchTerm = '%' + searchTerm + '%';
        
        return [
            SELECT
                Id, Name, Owner.Name, Budget__c, NumberOfEmployees, Industry, Description, Type
            FROM Account
            WHERE Name LIKE :searchTerm            
        ];
    }
}