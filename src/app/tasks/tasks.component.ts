import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IndexDbService } from '../services/indexdb.service';
import * as ObjectID from 'bson-objectid';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  collections = this.indexDbService.collections;
  list: any[] = [];
  taskForm: FormGroup;
  constructor(private indexDbService: IndexDbService) {
    this.taskForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
    this.refreshList();

    setTimeout(() => {
      this.runUpdate();
    }, 10 * 1000);
  }

  refreshList() {
    this.indexDbService.getAll(this.collections.tasks)
    .then(list => {
      this.list = list;
    });
  }
  onSubmit() {
    const data = Object.assign({}, { id: ObjectID.default().toHexString() }, this.taskForm.value);
    this.indexDbService.insertAutoKey(this.collections.tasks, data);
    this.refreshList();
    this.taskForm.reset();
  }


  runUpdate() {
    // const data = this.list[2];
    // data.name = 'hello';
    // data.status = 'done';
    // this.indexDbService.delete(this.collections.tasks, data.id);
    // this.refreshList();
  }
  get title() { return this.taskForm.get('title'); }

  get description() { return this.taskForm.get('description'); }



}
