class CreateShiftAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :shift_assignments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shift, null: false, foreign_key: true
      t.string :status
      t.text :notes

      t.timestamps
    end
  end
end
