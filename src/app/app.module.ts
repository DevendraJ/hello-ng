import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawComponent } from './draw/draw.component';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [AppComponent, DrawComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
