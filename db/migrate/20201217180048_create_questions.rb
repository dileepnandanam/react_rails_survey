class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.string :answertype
      t.string :name

      t.timestamps
    end
  end
end
