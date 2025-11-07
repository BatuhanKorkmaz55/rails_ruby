class AddRoleAndDepartmentToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :role, :string, default: 'employee'
    add_column :users, :department_id, :integer, null: true
    add_index :users, :department_id
  end
end
