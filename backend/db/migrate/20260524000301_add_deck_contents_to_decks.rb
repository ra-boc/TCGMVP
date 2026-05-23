class AddDeckContentsToDecks < ActiveRecord::Migration[8.1]
  def change
    add_column :decks, :deck_code, :string
    add_column :decks, :deck_url, :string
    add_column :decks, :deck_list, :text
  end
end
