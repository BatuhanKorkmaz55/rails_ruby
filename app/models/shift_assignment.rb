class ShiftAssignment < ApplicationRecord
  belongs_to :user
  belongs_to :shift

  enum status: { assigned: 'assigned', confirmed: 'confirmed', completed: 'completed', cancelled: 'cancelled' }

  validates :user_id, uniqueness: { scope: :shift_id, message: "has already been assigned to this shift" }
end
