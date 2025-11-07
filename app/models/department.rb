class Department < ApplicationRecord
  has_many :users
  has_many :shifts

  validates :name, presence: true
end
