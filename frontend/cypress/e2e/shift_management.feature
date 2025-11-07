Feature: Shift Management System
  Scenario: User can view shift management page
    Given I open the homepage
    Then I should see "Vardiya Yönetim Sistemi"
    And I should see "Takvim"
    And I should see "Vardiyalar"

  Scenario: User can see shifts in calendar
    Given I open the homepage
    When I wait for the page to load
    Then I should see a calendar
    And the calendar should display shifts

  Scenario: User can add a new shift
    Given I open the homepage
    When I wait for the page to load
    And I click on "Vardiya Ekle" button
    Then I should see "Yeni Vardiya Ekle" modal
    When I fill in shift form with date today, start time "09:00", end time "17:00", and type "Sabah"
    And I click on "Ekle" button
    Then I should see the new shift in the calendar

  Scenario: User can assign a shift to an employee
    Given I open the homepage
    When I wait for the page to load
    And I click on "Atama Yap" button
    Then I should see "Vardiya Atama" modal
    When I select an employee from the dropdown
    And I select a shift from the dropdown
    And I click on "Ata" button
    Then I should see the assignment in the assignments list

  Scenario: User can view employees tab
    Given I open the homepage
    When I wait for the page to load
    And I click on "Çalışanlar" tab
    Then I should see the employees list

  Scenario: User can view assignments tab
    Given I open the homepage
    When I wait for the page to load
    And I click on "Atamalar" tab
    Then I should see the assignments list

  Scenario: User can delete an employee
    Given I open the homepage
    When I wait for the page to load
    And I click on "Çalışanlar" tab
    And I confirm the deletion
    When I click on "Sil" button for an employee
    Then the employee should be removed from the list

  Scenario: User can delete an assignment
    Given I open the homepage
    When I wait for the page to load
    And I click on "Atama Yap" button
    Then I should see "Vardiya Atama" modal
    When I select an employee from the dropdown
    And I select a shift from the dropdown
    And I click on "Ata" button
    Then I should see the assignment in the assignments list
    When I click on "Atamalar" tab
    And I confirm the deletion
    When I click on "Sil" button for an assignment
    Then the assignment should be removed from the list
