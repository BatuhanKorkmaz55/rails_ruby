require 'rails_helper'

RSpec.describe Department, type: :model do
  describe "associations" do
    it { should have_many(:users) }
    it { should have_many(:shifts) }
  end

  describe "factory" do
    it "has a valid factory" do
      expect(build(:department)).to be_valid
    end
  end
end
