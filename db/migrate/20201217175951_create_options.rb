class CreateOptions < ActiveRecord::Migration[6.0]
  def change
    create_table :options do |t|
      t.string :name
      t.integer :question_id

      t.timestamps
    end
  end
end
