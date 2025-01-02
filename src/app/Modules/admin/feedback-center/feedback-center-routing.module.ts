import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AddSurveyComponent } from './components/add-survey/add-survey.component';

const routes: Routes = [
  {path:'feed-back',component:FeedbackComponent},
  {path:'add-survey',component:AddSurveyComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackCenterRoutingModule { }
