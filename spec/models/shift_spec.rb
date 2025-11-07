require 'rails_helper'

RSpec.describe Shift, type: :model do
  describe "associations" do
    it { should belong_to(:department).optional }
    it { should have_many(:shift_assignments) }
    it { should have_many(:users).through(:shift_assignments) }
  end

  describe "factory" do
    it "has a valid factory" do
      expect(build(:shift)).to be_valid
    end
  end
end
