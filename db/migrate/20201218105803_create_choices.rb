class CreateChoices < ActiveRecord::Migration[6.0]
  def change
    create_table :choices do |t|
      t.integer :option_id
      t.integer :answer_id

      t.timestamps
    end
  end
end
