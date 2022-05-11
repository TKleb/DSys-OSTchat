# Documentation
## Index
- [Idea](#idea)
- [Architecture overview](#architecture)
- [Security](#security)
- [Note on statelessness of containers](#note-on-statelessness-of-containers)
- [Useful links](#useful-links)

# Idea
Create a simple platform with a few pre-defined chat rooms, all of which are load-balanced and have built in redundancy.

# Architecture
![](Documentation/architecture.drawio.svg)

All instances of the backend are identical, stateless and interchangeable. 
Traefik routes individual subdirectories to individual replica sets. Therefore, each replica set only receives requests to, for example, chat#1 *or* chat#2. This allows each chat to work independently of the others and one replica set does not not suffer from other replica sets being overloaded.

The advantage of each replica set only dealing with one chat is a reduction in database queries, as they can request only the messages of the chat they belong to.

# Security
Security concerns (safe login, avoiding information through URL, etc.) have been disregarded for the sake of simplicity as the goal was to make a resilient system, not necessarily a secure one.

# Note on statelessness of containers
Statelessness is achieved by making the database the authoritative central storage of all data. Backends stay up to date by polling the database and passing along the latest message they are aware of - the database then returns all messages that are newer than the provided one. This way the instances don't require individual configuration and can stay up to date without the need for inter-replica communication.

Sessions are done via arguments in the URL. We are aware that this is not very safe; however, we opted against sinking additional time into this aspect of the project, as explained in the [security](#security) chapter.

# Useful links
- [Traefik TLS simple walkthrough](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-tls/)
