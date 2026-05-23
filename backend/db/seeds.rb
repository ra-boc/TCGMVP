user = User.find_or_create_by!(name: "Default User")

forest = user.decks.find_or_create_by!(name: "Tempo Forest") do |deck|
  deck.archetype = "Forestcraft"
  deck.notes = "Sample deck for the MVP."
end

user.decks.find_or_create_by!(name: "Midrange Sword") do |deck|
  deck.archetype = "Swordcraft"
end

if user.matches.none?
  user.matches.create!(
    deck: forest,
    opponent_deck: "Artifact Portal",
    result: "win",
    turn_order: "first",
    played_at: 1.day.ago,
    notes: "Good sample match."
  )

  user.matches.create!(
    deck: forest,
    opponent_deck: "Ramp Dragon",
    result: "loss",
    turn_order: "second",
    played_at: Time.current
  )
end
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
