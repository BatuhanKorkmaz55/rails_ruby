class User < ApplicationRecord
  belongs_to :department, optional: true
  has_many :shift_assignments
  has_many :shifts, through: :shift_assignments

  enum role: { employee: 'employee', manager: 'manager', admin: 'admin' }
end
