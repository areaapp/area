package com.example.area_android

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result


class ServiceActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_service)

        val app = this.application as AreaApplication
        val serviceName = intent.getStringExtra("service")

        val desc = findViewById<TextView>(R.id.serviceDescription)

        val add = findViewById<Button>(R.id.add)
        val modify = findViewById<Button>(R.id.modify)
        val delete = findViewById<Button>(R.id.delete)

        val actionList = findViewById<ListView>(R.id.actions)
        val reactionList = findViewById<ListView>(R.id.reactions)

        val url = app.serverUrl + "/services/" + serviceName
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                    }
                    is Result.Success -> {
                        val data = result.get().obj().getJSONObject("data")

                        this.supportActionBar!!.title = data.getString("displayName")
                        desc.text = data.getString("description")
                        val actionTexts: MutableList<Map<String, String>> = ArrayList()

                        val actions = data.getJSONArray("actions")
                        for (i in 0 until actions.length()) {
                            val action = actions.getJSONObject(i)
                            val datum: MutableMap<String, String> = HashMap()
                            datum["First Line"] = action.getString("displayName")
                            datum["Second Line"] = action.getString("description")
                            actionTexts.add(datum)
                        }

                        val actionAdapter = SimpleAdapter(this,
                            actionTexts,
                            android.R.layout.simple_list_item_2,
                            arrayOf("First Line", "Second Line"),
                            intArrayOf(android.R.id.text1, android.R.id.text2)
                        )
                        actionList.adapter = actionAdapter

                        val reactions = data.getJSONArray("actions")
                        for (i in 0 until actions.length()) {
                            val reaction = reactions.getJSONObject(i)
                            val datum: MutableMap<String, String> = HashMap()
                            datum["First Line"] = reaction.getString("displayName")
                            datum["Second Line"] = reaction.getString("description")
                            actionTexts.add(datum)
                        }

                        val reactionAdapter = SimpleAdapter(this,
                            actionTexts,
                            android.R.layout.simple_list_item_2,
                            arrayOf("First Line", "Second Line"),
                            intArrayOf(android.R.id.text1, android.R.id.text2)
                        )
                        reactionList.adapter = reactionAdapter
                    }
                }
            }

        Fuel.get(app.serverUrl + "/me/services")
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                val data = result.get().obj().getJSONObject("data")
                println("me services")
                println(data)
                if (data.has(serviceName)) {
                    add.isEnabled = false
                } else {
                    modify.isEnabled = false
                    delete.isEnabled = false
                }
            }

        add.setOnClickListener{
            this.redirectToService(serviceName)
        }

        modify.setOnClickListener {
            Toast.makeText(this, "Not implemented yet", Toast.LENGTH_SHORT).show()
        }

        delete.setOnClickListener {
            Fuel.delete(app.serverUrl + "/me/services/" + serviceName)
                .authentication()
                .bearer(app.token!!)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Success -> {
                            add.isEnabled = true
                            modify.isEnabled = false
                            delete.isEnabled = false
                            Toast.makeText(this, "Service deleted", Toast.LENGTH_SHORT).show()
                        }
                        is Result.Failure -> {
                            Toast.makeText(this, "Cannot delete service", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            this.finish()
            return
        }


        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                val data = result.get().obj().getString("data")

                app.redirectAction = AreaApplication.ActionType.AddService
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
                finish()
            }
    }
}
