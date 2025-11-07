class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts do |t|
      t.date :date
      t.time :start_time
      t.time :end_time
      t.string :shift_type
      t.string :status
      t.references :department, null: true, foreign_key: true

      t.timestamps
    end
  end
end
