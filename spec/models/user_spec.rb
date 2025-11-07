require 'rails_helper'

RSpec.describe User, type: :model do
  describe "associations" do
    it { should belong_to(:department).optional }
    it { should have_many(:shift_assignments) }
    it { should have_many(:shifts).through(:shift_assignments) }
  end

  # Note: Validations are not defined in the model yet
  # Uncomment when validations are added:
  # describe "validations" do
  #   it { should validate_presence_of(:name) }
  #   it { should validate_presence_of(:email) }
  # end

  describe "enums" do
    # Role is stored as string, not integer enum
    it "has role enum values" do
      expect(User.roles.keys).to include('employee', 'manager', 'admin')
    end
  end

  describe "factory" do
    it "has a valid factory" do
      expect(build(:user)).to be_valid
    end
  end
end

