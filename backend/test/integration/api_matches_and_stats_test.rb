require "test_helper"

class ApiMatchesAndStatsTest < ActionDispatch::IntegrationTest
  setup do
    User.destroy_all
    @user = User.create!(name: "Default User")
    @deck = @user.decks.create!(name: "Midrange Sword", archetype: "Swordcraft")
  end

  test "creates updates lists and deletes matches" do
    post api_matches_url,
      params: {
        match: {
          deck_id: @deck.id,
          opponent_deck: "Artifact Portal",
          result: "win",
          turn_order: "first",
          played_at: Time.current.iso8601,
          notes: "Close game"
        }
      },
      as: :json

    assert_response :created
    created = response.parsed_body
    assert_equal "Artifact Portal", created["opponent_deck"]
    assert_equal @deck.id, created["deck_id"]

    patch api_match_url(created["id"]),
      params: { match: { result: "loss", turn_order: "second" } },
      as: :json

    assert_response :success
    assert_equal "loss", response.parsed_body["result"]

    get api_matches_url

    assert_response :success
    assert_equal 1, response.parsed_body.length

    delete api_match_url(created["id"])

    assert_response :no_content
    assert_equal 0, Match.count
  end

  test "summarizes win rates" do
    @user.matches.create!(
      deck: @deck,
      opponent_deck: "Artifact Portal",
      result: "win",
      turn_order: "first",
      played_at: 2.days.ago
    )
    @user.matches.create!(
      deck: @deck,
      opponent_deck: "Artifact Portal",
      result: "loss",
      turn_order: "second",
      played_at: 1.day.ago
    )

    get api_stats_summary_url

    assert_response :success
    body = response.parsed_body
    assert_equal 2, body["overall"]["total"]
    assert_equal 50.0, body["overall"]["win_rate"]
    assert_equal 1, body["by_deck"].length
    assert_equal "Midrange Sword", body["by_deck"][0]["label"]
    assert_equal 50.0, body["by_opponent_deck"][0]["win_rate"]
  end
end
