
function C_SIGNPOST(props) {

	return (
		
		<R.Routes>

			<R.Route path='/:aid' 	element={<C.ACTILOG />}>

				<R.Route index element={<C.ACTIVITIES section="activities" />} />

				<R.Route path='activities' 	element={<C.ACTIVITIES_WARP section="activities" />}>

					<R.Route index 			element={<C.ACTIVITIES section="activities" />} />
					<R.Route path=':actid' 	element={<C.ACTIVITIES section="activities" />} />

				</R.Route>


				<R.Route path='projects' 	element={<C.PROJECTS_WARP />}>

					<R.Route index 			element={<C.PROJECTS section="projects" />} />
					<R.Route path=':pid' 	element={<C.PROJECTS section="projects" />} />

				</R.Route>

				<R.Route path='categories' 	element={<C.CATEGORIES_WARP />}>

					<R.Route index 			element={<C.CATEGORIES section="categories" />} />
					<R.Route path=':cid' 	element={<C.CATEGORIES section="categories" />} />

				</R.Route>

				<R.Route path='investors' 	element={<C.INVESTORS_WARP />}>

					<R.Route index 			element={<C.INVESTORS section="investors" />} />
					<R.Route path=':iid' 	element={<C.INVESTORS section="investors" />} />

				</R.Route>

				<R.Route path='sources' 	element={<C.SOURCES_WARP />}>

					<R.Route index 			element={<C.SOURCES section="sources" />} />
					<R.Route path=':sid' 	element={<C.SOURCES section="sources" />} />

				</R.Route>

				<R.Route path='settings' 	element={<C.SETTINGS section="settings" />} />

				<R.Route path='*' element={<C.NOT_FOUND />} /> 

			</R.Route>

			<R.Route path='*' element={<C.ACTILOG />} /> 

		</R.Routes>
		
	);

}

module.exports = C_SIGNPOST;

		//The "*" has special meaning here. It will match only when no other routes do.

									/*<R.Route path='categories' 	element={<C.CATEGORIES section="categories" />}>

										<R.Route path='upsert' 	element={<C.CATEGORIES_DETAIL />} />

									</R.Route>*/