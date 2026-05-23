# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_24_000300) do
  create_table "decks", force: :cascade do |t|
    t.string "archetype", default: "", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.text "notes"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id", "name"], name: "index_decks_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_decks_on_user_id"
  end

  create_table "matches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "deck_id", null: false
    t.text "notes"
    t.string "opponent_deck", null: false
    t.datetime "played_at", null: false
    t.string "result", null: false
    t.string "turn_order", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["deck_id", "played_at"], name: "index_matches_on_deck_id_and_played_at"
    t.index ["deck_id"], name: "index_matches_on_deck_id"
    t.index ["user_id", "opponent_deck"], name: "index_matches_on_user_id_and_opponent_deck"
    t.index ["user_id", "played_at"], name: "index_matches_on_user_id_and_played_at"
    t.index ["user_id", "turn_order"], name: "index_matches_on_user_id_and_turn_order"
    t.index ["user_id"], name: "index_matches_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "decks", "users"
  add_foreign_key "matches", "decks"
  add_foreign_key "matches", "users"
end
