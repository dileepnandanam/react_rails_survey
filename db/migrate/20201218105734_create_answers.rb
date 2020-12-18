class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :answers do |t|
      t.integer :question_id
      t.string :integer
      t.string :text_field
      t.text :textarea
      t.integer :response_id

      t.timestamps
    end
  end
end
