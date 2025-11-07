require 'rails_helper'

RSpec.describe ShiftAssignment, type: :model do
  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:shift) }
  end

  describe "factory" do
    it "has a valid factory" do
      expect(build(:shift_assignment)).to be_valid
    end
  end
end
