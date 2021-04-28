from api.decorators import smart_api
from api.security import AccessLevel
from graphene import ObjectType, Boolean, NonNull, String, ResolveInfo, Int, ID, List
from graphql import GraphQLError
from .types import User, PlayableCard
from .inputs import LobbySettings
from database import Database


class Mutation(ObjectType):
	# user management
	register = NonNull(Boolean, name=NonNull(String), password_hash=NonNull(String), salt=NonNull(String), hash_type=NonNull(String))
	login = NonNull(User, name=NonNull(String), password_hash=NonNull(String))
	logout = NonNull(Boolean)


	@smart_api(access = AccessLevel.ADMINISTRATOR)
	async def resolve_register(root, info: ResolveInfo, name: str, password_hash: str, salt: str, hash_type: str):
		db: Database = info.context["request"].db
		try:
			await db.register_user(name, password_hash, salt, hash_type)
		except:
			raise GraphQLError(f"User '{name}' already exists.'")
		return True


	@smart_api()
	async def resolve_login(root, info: ResolveInfo, name: str, password_hash: str):
		db: Database = info.context["request"].db
		cookie = await db.login(name, password_hash)


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_logout(root, info: ResolveInfo):
		pass


	# lobby management
	create_lobby = NonNull(String)
	change_lobby_settings = NonNull(Boolean, settings=NonNull(LobbySettings))
	join_lobby = NonNull(Boolean, code=NonNull(String))
	leave_lobby = NonNull(Boolean)
	start_game = NonNull(Boolean)


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_create_lobby(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_change_lobby_settings(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_join_lobby(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_leave_lobby(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_start_game(root, info: ResolveInfo):
		pass


	# game logic
	play_card = List(NonNull(PlayableCard), id=NonNull(ID))
	call_tricks = NonNull(Boolean, amount=NonNull(Int))
	complete_action = NonNull(Boolean, argument=String())


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_play_card(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_call_tricks(root, info: ResolveInfo):
		pass


	@smart_api(access = AccessLevel.NORMAL_USER)
	def resolve_complete_action(root, info: ResolveInfo):
		pass