#!/bin/bash

#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Artists?filter[limit]=20' > artist.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Images?filter[limit]=20' > image.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Series?filter[limit]=20' > series.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Festivals?filter[limit]=20' > festival.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Dates?filter[limit]=20' > date.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Days?filter[limit]=20' > day.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Sets?filter[limit]=20' > set.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Lineups?filter[limit]=20' > lineup.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Venues?filter[limit]=20' > venue.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Organizers?filter[limit]=20' > organizer.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Places?filter[limit]=20' > place.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/ArtistPriorities?filter[limit]=20' > artistPriority.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/StagePriorities?filter[limit]=20' > stagePriority.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/StageLayouts?filter[limit]=20' > stageLayout.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/PlaceTypes?filter[limit]=20' > placeType.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/ArtistAliases?filter[limit]=20' > artistAlias.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/ParentGenres?filter[limit]=20' > parentGenre.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Genres?filter[limit]=20' > genre.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/ArtistGenres?filter[limit]=20' > artistGenre.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/MessageTypes?filter[limit]=20' > messageType.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/SubjectTypes?filter[limit]=20' > subjectType.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Messages?filter[limit]=20' > message.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Messages?filter[limit]=20&filter[where][and][0][messageType]=2&filter[where][and][1][subjectType]=2' > artistRating.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/MessagesMonitors?filter[limit]=20' > messagesMonitor.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Intentions?filter[limit]=20' > intention.json
#	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/Users?filter[limit]=20' > user.json
	curl -X GET --header 'Accept: application/json' 'http://localhost:8080/api/core/all/data' > core.json
	