require "test_helper"

class ApiDecksTest < ActionDispatch::IntegrationTest
  setup do
    User.destroy_all
  end

  test "creates updates lists and deletes decks" do
    post api_decks_url,
      params: { deck: { name: "Tempo Forest", archetype: "Forestcraft", notes: "Main deck", deck_code: "a1b2", deck_url: "https://shadowverse-wb.com/ja/deck/?format_1", deck_list: "Card A x3\nCard B x3" } },
      as: :json

    assert_response :created
    created = response.parsed_body
    assert_equal "Tempo Forest", created["name"]
    assert_equal "a1b2", created["deck_code"]
    assert_equal "https://shadowverse-wb.com/ja/deck/?format_1", created["deck_url"]
    assert_equal "Card A x3\nCard B x3", created["deck_list"]

    patch api_deck_url(created["id"]),
      params: { deck: { name: "Tempo Forest Evolved", archetype: "Forestcraft", notes: "", deck_code: "c3d4" } },
      as: :json

    assert_response :success
    assert_equal "Tempo Forest Evolved", response.parsed_body["name"]
    assert_equal "c3d4", response.parsed_body["deck_code"]

    get api_decks_url

    assert_response :success
    assert_equal 1, response.parsed_body.length

    delete api_deck_url(created["id"])

    assert_response :no_content
    assert_equal 0, Deck.count
  end

  test "returns validation errors for invalid deck" do
    post api_decks_url, params: { deck: { name: "" } }, as: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"].join, "Name"
  end
end
