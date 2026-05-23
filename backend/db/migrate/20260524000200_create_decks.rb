class CreateDecks < ActiveRecord::Migration[8.1]
  def change
    create_table :decks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :archetype, null: false, default: ""
      t.text :notes

      t.timestamps
    end

    add_index :decks, [:user_id, :name], unique: true
  end
end
