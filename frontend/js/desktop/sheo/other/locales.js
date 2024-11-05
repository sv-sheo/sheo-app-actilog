
var locales = {

	content: {

		header: {

			id: 			{cz: '#', en: '#', de: '#'},
			date: 			{cz: 'Datum', en: 'Date', de: 'Datum'},
			year: 			{cz: 'Rok', en: 'Year', de: 'Jahr'},
			n: 				{cz: '#', en: '#', de: '#'},
			name: 			{cz: 'Název', en: 'Name', de: 'Name'},
			activity: 		{cz: 'Činnost', en: 'Activity', de: 'Aktivität'},
			project: 		{cz: 'Projekt', en: 'Project', de: 'Projekt'},
			category: 		{cz: 'Kategorie', en: 'Category', de: 'Kategorie'},
			investor: 		{cz: 'Investor', en: 'Investor', de: 'Investor'},
			source: 		{cz: 'Zadal', en: 'Source', de: 'Quelle'},
			projects: 		{cz: 'PR', en: 'PR', de: 'PR'},
			activities: 	{cz: 'ACT', en: 'ACT', de: 'ACT'},
			time_spent: 	{cz: 'T', en: 'T', de: 'Z'},
			efficiency: 	{cz: 'EFF', en: 'EFF', de: 'EFF'},
			eff_time_spent: {cz: 'EFF_T', en: 'EFF_T', de: 'EFF_Z'},
			expected_yield: {cz: 'OZ', en: 'EY', de: 'EE'},
			paid: 			{cz: 'PAID', en: 'PAID', de: 'Bezahlt'},
			actual_yield: 	{cz: 'SZ', en: 'AY', de: 'TE'},
			finished: 		{cz: 'DOK', en: 'D', de: 'F'},
			/* investor */
			address: 		{cz: 'Adresa', en: 'Address', de: 'Adresse'},
			/* date */
			date_from: 		{cz: 'Od', en: 'From', de: 'Von'},
			date_to: 		{cz: 'Do', en: 'To', de: 'Bis'},

			id_hint: 			{cz: 'ID projektu', en: 'Project ID', de: 'Projekt ID'},
			year_hint: 			{cz: 'Rok', en: 'Year', de: 'Jahr'},
			date_hint: 			{cz: 'Datum', en: 'Date', de: 'Datum'},
			n_hint: 			{cz: 'Číslo projektu', en: 'Project number', de: 'Projektnummer'},
			name_hint: 			{cz: 'Název', en: 'Name', de: 'Name'},
			activity_hint: 		{cz: 'Činnost', en: 'Activity', de: 'Aktivität'},
			project_hint: 		{cz: 'Projekt', en: 'Project', de: 'Projekt'},
			category_hint: 		{cz: 'Kategorie', en: 'Category', de: 'Kategorie'},
			investor_hint: 		{cz: 'Investor', en: 'Investor', de: 'Investor'},
			source_hint: 		{cz: 'Zadal', en: 'Source', de: 'Quelle'},
			projects_hint: 		{cz: 'Počet projektů', en: 'Project count', de: 'Projektanzahl'},
			activities_hint: 	{cz: 'Počet aktivit', en: 'Activity count', de: 'Die Anzahl der Aktivitäten'},
			time_spent_hint: 	{cz: 'Strávený čas', en: 'Time Spent', de: 'Zeitaufwand'},
			efficiency_hint: 	{cz: 'Efektivita', en: 'Efficiency', de: 'Effizienz'},
			eff_time_spent_hint:{cz: 'Efektivní čas', en: 'Effective Time Spent', de: 'Effektiv Zeitaufwand'},
			expected_yield_hint:{cz: 'Očekávaný Zisk', en: 'Expected Yield', de: 'Erwarteter Ertrag'},
			paid_hint: 			{cz: 'Zaplaceno', en: 'Paid', de: 'Bezahlt'},
			actual_yield_hint: 	{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
			finished_hint: 		{cz: 'Dokončeno', en: 'Done', de: 'Fertig'},
			/* investor */
			address_hint: 		{cz: 'Adresa', en: 'Address', de: 'Adresse'},

			add_button: 		{cz: 'Přidat projekt', en: 'Add project', de: 'Projekt hinzufügen'},
			charts_button: 		{cz: 'Zobrazit grafy', en: 'Show charts', de: 'Diagramme anzeigen'},
			hide_charts: 		{cz: 'Schovat grafy', en: 'Hide charts', de: 'Diagramme ausblenden'},

		},

		detail: {

			year: 				{cz: 'Rok', en: 'Year', de: 'Jahr'},
			n: 					{cz: 'číslo projektu', en: 'Project number', de: 'Projektnummer'},
			name: 				{cz: 'Název', en: 'Name', de: 'Name'},
			description: 		{cz: 'Popis', en: 'Description', de: 'Bezeichnung '},
			activity: 			{cz: 'Činnost', en: 'Activity', de: 'Aktivität'},
			project: 			{cz: 'Projekt', en: 'Project', de: 'Projekt'},
			category: 			{cz: 'Kategorie', en: 'Category', de: 'Kategorie'},
			investor: 			{cz: 'Investor', en: 'Investor', de: 'Investor'},
			source: 			{cz: 'Zadal', en: 'Source', de: 'Quelle'},
			time_spent: 		{cz: 'Strávený čas', en: 'Time Spent', de: 'Zeitaufwand'},
			efficiency: 		{cz: 'Efektivita', en: 'Efficiency', de: 'Effizienz'},
			eff_time_spent: 	{cz: 'Efektivní čas', en: 'Effective Time Spent', de: 'Effektiv Zeitaufwand'},
			expected_yield: 	{cz: 'Očekávaný Zisk', en: 'Expected Yield', de: 'Erwarteter Ertrag'},
			paid: 				{cz: 'Zaplaceno', en: 'Paid', de: 'Bezahlt'},
			actual_yield: 		{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
			finished: 			{cz: 'Dokončeno', en: 'Finished', de: 'Fertig'},
			activities_count: 	{cz: 'Počet aktivit', en: 'Activity count', de: 'Anzahl der Aktivitäten'},
			projects_count: 	{cz: 'Počet projektů', en: 'Project count', de: 'Anzahl der Projekte'},
			date: 				{cz: 'Datum vytvoření', en: 'Created', de: 'Erstellungsdatum'},
			date_plain: 		{cz: 'Datum', en: 'Date', de: 'Datum'},
			clock: 				{cz: 'Čas', en: 'Clock', de: 'Uhren'},

			expected_hourly_yield:	{cz: 'Hodinová sazba', en: 'Hourly Yield', de: 'Stunden-Rate'},

			edit_button: 		{cz: 'Upravit projekt', en: 'Edit project', de: 'bearbeiten'},
			close_button: 		{cz: 'Zavřít', en: 'Close', de: 'schließen'},
			remove_button: 		{cz: 'Odstranit projekt', en: 'Remove project', de: 'Projekt entfernen'},

			remove_info: 		{cz: 'Vyberte prosím projekt, do kterého se přesunou aktivity tohoto projektu.', en: 'Please select which project should the activities of this project move to.', de: 'Bitte wählen Sie aus, in welches Projekt die Aktivitäten dieses Projekts verschoben werden sollen.'},
			remove_confirm: 	{cz: 'Opravdu chcete odstranit tento projekt?', en: 'Are you sure that you want to remove this project?', de: 'Möchten Sie dieses Projekt wirklich löschen?'},

		},

		form: {

			general: {

				submit: 	{cz: 'Uložit', en: 'Save', de: 'Speichern'},
				cancel: 	{cz: 'Zrušit', en: 'Cancel', de: 'Abbrechen'},

				name: 		{cz: 'Název', en: 'Name', de: 'Name'},
				description:{cz: 'Popis', en: 'Description', de: 'Bezeichnung'},
				activity: 	{cz: 'Činnost', en: 'Activity', de: 'Aktivität'},
				project: 	{cz: 'Projekt', en: 'Project', de: 'Projekt'},
				category: 	{cz: 'Kategorie', en: 'Category', de: 'Kategorie'},
				investor: 	{cz: 'Investor', en: 'Investor', de: 'Investor'},
				source: 	{cz: 'Zadal', en: 'Source', de: 'Quelle'},
				paid: 		{cz: 'Zaplaceno', en: 'Paid', de: 'Bezahlt'},
				finished: 	{cz: 'Dokončeno', en: 'Done', de: 'Fertig'},
				date:		{cz: 'Datum', en: 'Date', de: 'Datum'},
				clock: 		{cz: 'Čas', en: 'Clock', de: 'Uhren'},

				actual_yield:			{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
				expected_hourly_yield:	{cz: 'Hodinová sazba', en: 'Hourly Yield', de: 'Stunden-Rate'},

			},

			activity: {

				name: 			{cz: 'Název', en: 'Name', de: 'Name'},
				description:	{cz: 'Popis', en: 'Description', de: 'Bezeichnung'},
				activity: 		{cz: 'Činnost', en: 'Activity', de: 'Aktivität'},
				project: 		{cz: 'Projekt', en: 'Project', de: 'Projekt'},
				date:			{cz: 'Datum', en: 'Date', de: 'Datum'},
				clock: 			{cz: 'Čas', en: 'Clock', de: 'Uhren'},
				time: 			{cz: 'Strávený čas', en: 'Time Spent', de: 'Zeitaufwand'},
				efficiency: 	{cz: 'Efektivita', en: 'Efficiency', de: 'Effizienz'},
				eff_time: 		{cz: 'Efektivní čas', en: 'Effective Time Spent', de: 'Effektiv Zeitaufwand'},

				actual_yield:	{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
				expected_yield:	{cz: 'Očekávaný sazba', en: 'Expected Yield', de: 'Erwarteter Ertrag'},

				add_button: 	{cz: 'Přidat aktivitu', en: 'Add activity', de: 'Hinzufügen'},
				edit_button:	{cz: 'Upravit aktivitu', en: 'Edit activity', de: 'Aktivität bearbeiten: '},
				new_header: 	{cz: 'Nová aktivita', en: 'New activity', de: 'neue Aktivität'},
				edit_header:	{cz: 'Upravit aktivitu', en: 'Edit activity', de: 'Aktivität bearbeiten: '},

				success: 		{cz: 'Úspěšně byla vytvořena nová aktivita: ', en: 'Successfully created new activity: ', de: 'Neue Aktivität wurde erfolgreich erstellt: '},
				success_edit:	{cz: 'Aktivita byla úspěšně upravena.', en: 'Activity was succesfully updated.', de: 'Aktivität wurde erfolgreich aktualisiert.'},
				success_remove:	{cz: 'Aktivita byla úspěšně odstraněna.', en: 'Activity was succesfully removed.', de: 'Aktivität wurde erfolgreich entfernen.'},

			},

			project: {

				//{n: 1, name: '', description: '', date: now.getTime(), category: 0, investor: 0, expected_hourly_yield: 0, actual_yield: 0, paid: 0, finished: 0}

				n: 			{cz: 'Číslo projektu', en: 'Project number', de: 'Projektnummer'},
				name: 		{cz: 'Název', en: 'Name', de: 'Name'},
				description:{cz: 'Popis', en: 'Description', de: 'Bezeichnung'},
				category: 	{cz: 'Kategorie', en: 'Category', de: 'Kategorie'},
				investor: 	{cz: 'Investor', en: 'Investor', de: 'Investor'},
				source: 	{cz: 'Zadal', en: 'Source', de: 'Quelle'},
				paid: 		{cz: 'Zaplaceno', en: 'Paid', de: 'Bezahlt'},
				finished: 	{cz: 'Dokončeno', en: 'Done', de: 'Fertig'},
				date: 		{cz: 'Založen', en: 'Created', de: 'Erstellt'},

				actual_yield:			{cz: 'Skutečný Zisk', en: 'Actual Yield', de: 'Tatsächlicher Ertrag'},
				expected_hourly_yield:	{cz: 'Hodinová sazba', en: 'Hourly Yield', de: 'Stunden-Rate'},

				add_button: {cz: 'Přidat projekt', en: 'Add project', de: 'Hinzufügen'},
				edit_button:{cz: 'Upravit projekt', en: 'Edit project', de: 'Projekt bearbeiten: '},
				new_header: {cz: 'Nový projekt', en: 'New project', de: 'neues Projekt'},
				edit_header:{cz: 'Upravit projekt', en: 'Edit project', de: 'Projekt bearbeiten: '},

				success: 		{cz: 'Úspěšně byl vytvořen nový projekt: ', en: 'Successfully created new project: ', de: 'Neues Projekt wurde erfolgreich erstellt: '},
				success_edit:	{cz: 'Projekt byl úspěšně upraven.', en: 'Project was succesfully updated.', de: 'Projekt wurde erfolgreich aktualisiert.'},
				success_remove:	{cz: 'Projekt byl úspěšně odstraněn.', en: 'Project was succesfully removed.', de: 'Projekt wurde erfolgreich entfernen.'},

			},

			category: {

				name: 		{cz: 'Název', en: 'Name', de: 'Name'},

				add_button: {cz: 'Přidat kategorii', en: 'Add category', de: 'Hinzufügen'},
				edit_button:{cz: 'Upravit kategorii', en: 'Edit category', de: 'Kategorie bearbeiten: '},
				new_header: {cz: 'Nová kategorie', en: 'New category', de: 'neue Kategorie'},
				edit_header:{cz: 'Upravit kategorii', en: 'Edit category', de: 'Kategorie bearbeiten: '},

				success: 		{cz: 'Úspěšně byla vytvořena nová kategorie: ', en: 'Successfully created new category: ', de: 'Neue Kategorie wurde erfolgreich erstellt: '},
				success_edit:	{cz: 'Kategorie byla úspěšně upravena.', en: 'Category was succesfully updated.', de: 'Kategorie wurde erfolgreich aktualisiert.'},
				success_remove:	{cz: 'Kategorie byla úspěšně odstraněna.', en: 'Category was succesfully removed.', de: 'Kategorie wurde erfolgreich entfernen.'},

			},

			investor: {

				name: 		{cz: 'Název', en: 'Name', de: 'Name'},
				address: 	{cz: 'Adresa', en: 'Address', de: 'Adresse'},
				email: 		{cz: 'E-mail', en: 'E-mail', de: 'E-mail'},
				phone: 		{cz: 'Mobil', en: 'Phone number', de: 'Telefonnummer'},

				add_button: {cz: 'Přidat investora', en: 'Add investor', de: 'Hinzufügen'},
				edit_button:{cz: 'Upravit investora', en: 'Edit investor', de: 'Investor bearbeiten: '},
				new_header: {cz: 'Nový investor', en: 'New investor', de: 'neuer Investor'},
				edit_header:{cz: 'Upravit investora', en: 'Edit investor', de: 'Investor bearbeiten: '},

				success: 		{cz: 'Úspěšně byl vytvořen nový investor: ', en: 'Successfully created new investor: ', de: 'Neuer Investor wurde erfolgreich erstellt: '},
				success_edit:	{cz: 'Investor byl úspěšně upraven.', en: 'Investor was succesfully updated.', de: 'Investor wurde erfolgreich aktualisiert.'},
				success_remove:	{cz: 'Investor byl úspěšně odstraněn.', en: 'Investor was succesfully removed.', de: 'Investor wurde erfolgreich entfernen.'},

			},

			source: {

				name: 		{cz: 'Název', en: 'Name', de: 'Name'},

				add_button: {cz: 'Přidat zdroj', en: 'Add source', de: 'Hinzufügen'},
				edit_button:{cz: 'Upravit zdroj', en: 'Edit source', de: 'Quelle bearbeiten: '},
				new_header: {cz: 'Nový zdroj', en: 'New source', de: 'neue Quelle'},
				edit_header:{cz: 'Upravit zdroj', en: 'Edit source', de: 'Quelle bearbeiten: '},

				success: 		{cz: 'Úspěšně byl vytvořen nový zdroj: ', en: 'Successfully created new source: ', de: 'Neue Quelle wurde erfolgreich erstellt: '},
				success_edit:	{cz: 'Zdroj byl úspěšně upraven.', en: 'Source was succesfully updated.', de: 'Quelle wurde erfolgreich aktualisiert.'},
				success_remove:	{cz: 'Zdroj byl úspěšně odstraněn.', en: 'Source was succesfully removed.', de: 'Quelle wurde erfolgreich entfernen.'},

			},


		},

		activity: {

			add_button: 		{cz: 'Přidat', en: 'Add', de: 'Hinzufügen'},
			edit_button: 		{cz: 'Upravit', en: 'Edit', de: 'Bearbeiten'},
			close_button: 		{cz: 'Zavřít', en: 'Close', de: 'Schließen'},
			remove_button: 		{cz: 'Odstranit', en: 'Remove', de: 'Entfernen'},
			remove_confirm: 	{cz: 'Opravdu chcete odstranit tuto aktivitu?', en: 'Are you sure that you want to remove this activity?', de: 'Möchten Sie diese Aktivität wirklich entfernen?'},

		},

		category: {

			add_button: 		{cz: 'Přidat kategorii', en: 'Add category', de: 'Hinzufügen'},

			edit_button: 		{cz: 'Upravit kategorii', en: 'Edit category', de: 'bearbeiten'},
			close_button: 		{cz: 'Zavřít', en: 'Close', de: 'Schließen'},
			remove_button: 		{cz: 'Odstranit kategorii', en: 'Remove category', de: 'Kategorie entfernen'},
			remove_info: 		{cz: 'Vyberte prosím kategorii, do které se přesunou projekty z této kategorie.', en: 'Please select which category should the projects of this category move to.', de: 'Bitte wählen Sie aus, in welche Kategorie den Projekten diese Kategorie verschoben werden sollen.'},
			remove_confirm: 	{cz: 'Opravdu chcete odstranit tuto kategorii?', en: 'Are you sure that you want to remove this category?', de: 'Möchten Sie diese Kategorie wirklich entfernen?'},

		},

		investor: {

			address: 	{cz: 'Adresa', en: 'Address', de: 'Adresse'},
			email: 		{cz: 'E-mail', en: 'E-mail', de: 'E-mail'},
			phone: 		{cz: 'Mobil', en: 'Phone number', de: 'Telefonnummer'},

			add_button: 		{cz: 'Přidat investora', en: 'Add investor', de: 'Hinzufügen'},

			edit_button: 		{cz: 'Upravit investora', en: 'Edit investor', de: 'bearbeiten'},
			close_button: 		{cz: 'Zavřít', en: 'Close', de: 'Schließen'},
			remove_button: 		{cz: 'Odstranit investora', en: 'Remove investor', de: 'Investor entfernen'},
			remove_info: 		{cz: 'Vyberte prosím investora, do kterého se přesunou projekty z tohoto investora.', en: 'Please select which investor should the projects of this investor move to.', de: 'Bitte wählen Sie einen Investor aus, an den Projekte von diesem Investor übertragen werden.'},
			remove_confirm: 	{cz: 'Opravdu chcete odstranit tohoto investora?', en: 'Are you sure that you want to remove this investor?', de: 'Möchten Sie diesen Investor wirklich entfernen?'},

		},

		source: {

			add_button: 		{cz: 'Přidat zdroj', en: 'Add source', de: 'Hinzufügen'},

			edit_button: 		{cz: 'Upravit zdroj', en: 'Edit source', de: 'bearbeiten'},
			close_button: 		{cz: 'Zavřít', en: 'Close', de: 'Schließen'},
			remove_button: 		{cz: 'Odstranit zdroj', en: 'Remove source', de: 'Kategorie entfernen'},
			remove_info: 		{cz: 'Vyberte prosím zdroj, do kterého se přesunou projekty z tohoto zdroj.', en: 'Please select which source should the projects of this source move to.', de: 'Bitte wählen Sie aus, in welche Quelle den Projekten diese Kategorie verschoben werden sollen.'},
			remove_confirm: 	{cz: 'Opravdu chcete odstranit tento zdroj?', en: 'Are you sure that you want to remove this source?', de: 'Möchten Sie diese Quelle wirklich entfernen?'},

		},

		validation: {

			unknown: 			{cz: 'Neznámá chyba!', en: 'Unknown error!', de: 'unbekannter Fehler!'},
			invalid_language:	{cz: 'Neznámý jazyk!', en: 'Invalid language!', de: 'unbekannte Sprache!'},
			not_a_number:		{cz: 'Musí to být číslo!', en: 'It must be a number!', de: 'Es muss eine Zahl sein!'},
			required:			{cz: 'Toto pole je povinné!', en: 'This field is required!', de: 'Dieses Feld wird benötigt!'},
			number_too_low:		{cz: 'Číslo je příliš nízké!', en: 'The number is too low!', de: 'Die Zahl ist zu niedrig!'},
			number_too_high:	{cz: 'Číslo je příliš vysoké!', en: 'The number is too high!', de: 'Die Zahl ist zu hoch!'},
			text_too_low:		{cz: 'Text je příliš krátký!', en: 'The text is too short!', de: 'Der Text ist zu kurz!'},
			text_too_high:		{cz: 'Text je příliš dlouhý!', en: 'The text is too long!', de: 'Der Text ist zu lang!'},
			date_too_low:		{cz: 'Datum je příliš brzy!', en: 'The date is too soon!', de: 'Das Datum ist zu früh!'},
			date_too_high:		{cz: 'Datum je příliš pozdě!', en: 'The date is too late!', de: 'Die Zahl ist zu spät!'},
			invalid_option:		{cz: 'Neplatná hodnota!', en: 'Invalid option!', de: 'ungültige Option!'},

		},

		charts: {

			header: 				{cz: 'Grafy', en: 'Charts', de: 'Diagramme'},
			daily_yield_time: 		{cz: 'Denní přehled', en: 'Daily overview', de: 'Tagesübersicht'},
			monthly_yield_time: 	{cz: 'Měsíční přehled', en: 'Monthly overview', de: 'Monatsübersicht'},
			time_by_categories: 	{cz: 'Zisk dle kategorií', en: 'Yield by categories', de: 'Ertrag nach Kategorien'},
			time_by_investors: 		{cz: 'Zisk dle investorů', en: 'Yield by investors', de: 'Ertrag nach Investoren'},
			time_by_sources: 		{cz: 'Zisk dle zdrojů', en: 'Yield by sources', de: 'Ertrag nach Quellen'},
			yield:					{cz: 'Zisk', en: 'Yield', de: 'Zeit'},
			time:					{cz: 'Čas', en: 'Time', de: 'Ertrag'},
			eff_time:				{cz: 'Efektivní čas', en: 'Effective Time Spent', de: 'Effektiv Zeitaufwand'},

		},

		settings: {

			header: 				{cz: 'Nastavení', en: 'Settings', de: 'Einstellungen'},
			yield:					{cz: 'Zisk', en: 'Yield', de: 'Zeit'},
			time:					{cz: 'Čas', en: 'Time', de: 'Ertrag'},
			currency:				{cz: 'Měna', en: 'Currency', de: 'Währung'},
			price_decimals:			{cz: 'Desetinné místo měny', en: 'Price decimals', de: 'Preis Dezimalstellen'},
			time_spent_decimals:	{cz: 'Desetinné místo času', en: 'Time decimals', de: 'Währung Dezimalstellen'},
			download_years:			{cz: 'Roky stažené při načtení', en: 'Years downloaded on load', de: 'Jahre beim Laden heruntergeladen'},
			units:					{cz: 'Jednotky', en: 'Units', de: 'Einheiten'},
			values:					{cz: 'Hodnoty', en: 'Values', de: 'Werte'},
			other:					{cz: 'Ostatní', en: 'Other', de: 'Sonstiges'},
			rights:					{cz: 'Práva', en: 'Rights', de: 'Rechts'},
			read:					{cz: 'Čtení a prohlížení', en: 'Read', de: 'Leserechte'},
			write:					{cz: 'Vkládání a upravovaní', en: 'Write', de: 'Schreibrechte'},
			public:					{cz: 'Veřejné', en: 'Public', de: 'Öffentlichkeit'},
			limited:				{cz: 'Omezené', en: 'Restricted', de: 'Beschränkt'},
			private:				{cz: 'Soukromé', en: 'Private', de: 'Privatgelände'},
			none:					{cz: 'Žádné', en: 'None', de: 'Keine'},
			right_souls:			{cz: 'Omezení dle uživatelů', en: 'Restricted by user IDs', de: 'Eingeschränkt durch Benutzer-IDs'},
			right_link:				{cz: 'Omezení - přístup přes odkaz', en: 'Restricted by access link', de: 'Eingeschränkt durch Zugangslink'},
			generate_link:			{cz: 'Vytvořit odkaz', en: 'Create access link', de: 'Zugangslink erstellen'},
			remove_link:			{cz: 'Odstranit odkaz', en: 'Remove access link', de: 'Zugangslink entfernen'},
			export:					{cz: 'Export', en: 'Export', de: 'Export'},

		},

		general: {

			yield:					{cz: 'Zisk', en: 'Yield', de: 'Zeit'},
			time:					{cz: 'Čas', en: 'Time', de: 'Ertrag'},
			currency:				{cz: 'Měna', en: 'Currency', de: 'Währung'},

			saving:					{cz: 'Ukládám...', en: 'Saving...', de: 'Speichern...'},
			saved:					{cz: 'Uloženo', en: 'Saved', de: 'Gespeichert'},

			not_authorized:			{cz: 'Nemáte dostatečná práva.', en: 'Not athorized.', de: 'Nicht berechtigt.'},
			not_valid:				{cz: 'Neplatná hodnota.', en: 'Invalid value.', de: 'Ungültiger Wert.'},

		}

	},

	GET: function(lang, key) {

		var w = _.get(WH.locales, key) || {};
		var r = {};

		if(w.en && w.cz && w.de) {

			r = w[lang];

		} else {

			_.forEach(w, function(c, key) { r[key] = c[lang]; });

		}

		return r;

	}

}

module.exports = locales;