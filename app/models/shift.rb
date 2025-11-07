class Shift < ApplicationRecord
  belongs_to :department, optional: true
  has_many :shift_assignments
  has_many :users, through: :shift_assignments

  enum shift_type: { morning: 'morning', afternoon: 'afternoon', night: 'night' }
  enum status: { scheduled: 'scheduled', in_progress: 'in_progress', completed: 'completed', cancelled: 'cancelled' }

  validates :date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :shift_type, presence: true
end
