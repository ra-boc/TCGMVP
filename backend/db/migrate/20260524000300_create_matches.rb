class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :user, null: false, foreign_key: true
      t.references :deck, null: false, foreign_key: true
      t.string :opponent_deck, null: false
      t.string :result, null: false
      t.string :turn_order, null: false
      t.datetime :played_at, null: false
      t.text :notes

      t.timestamps
    end

    add_index :matches, [:user_id, :played_at]
    add_index :matches, [:deck_id, :played_at]
    add_index :matches, [:user_id, :opponent_deck]
    add_index :matches, [:user_id, :turn_order]
  end
end
