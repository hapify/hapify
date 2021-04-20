/*
 * Load the translator module
 */
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModuleWithProviders } from '@angular/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(http);
}

export function TranslateModuleLoad(): ModuleWithProviders<TranslateModule> {
	return TranslateModule.forRoot({
		loader: {
			provide: TranslateLoader,
			useFactory: HttpLoaderFactory,
			deps: [HttpClient],
		},
	});
}
